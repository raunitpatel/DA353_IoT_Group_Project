def valid_data(data: dict) -> bool:
    """
    Validates the input data dictionary to ensure it contains all required features
    and that certain features are convertible to float.

    Args:
        data (dict): The input dictionary containing water quality parameters.

    Returns:
        bool: True if data is valid, False otherwise.
    """
    req_features = ["area", "areaname", "block", "ph", "turbidity", "watertemperature", 
                    "totaldissolvedsolids", "conductivity", "chlorine", "fluoride"]

    # Check for required features
    if len(data.keys()) != len(req_features):
        return False
    
    if set(data.keys()) != set(req_features):
        return False

    ml_features = ["ph", "turbidity", "watertemperature", 
                   "totaldissolvedsolids", "conductivity", "chlorine", "fluoride"]

    # Validate that ML features can be converted to float
    try:
        for col in ml_features:
            float(data[col])
    except (ValueError, TypeError, KeyError):
        return False

    return True
